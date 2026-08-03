import { fetchMembers } from './member.service';
import type { Member } from '../types/member';
import type { ErgoTreeNode, SpouseNode } from '../types/tree';

export async function buildErgoTreeFromDB(
  familyId?: string,
  focusMemberId?: string,
): Promise<{ rootNodes: ErgoTreeNode[]; allMembers: Member[] }> {
  try {
    // Fetch all members from API
    const res = await fetchMembers({ familyId, limit: 100 });
    const allMembers = Array.isArray(res?.items) ? res.items : [];

    if (allMembers.length === 0) {
      return { rootNodes: [], allMembers: [] };
    }

    // Create lookup map
    const memberMap = new Map<string, Member>();
    allMembers.forEach((m) => memberMap.set(m.id, m));

    // Helper to convert Member to ErgoTreeNode
    const convertNode = (m: Member, isFocus: boolean = false): ErgoTreeNode => {
      const spouses: SpouseNode[] = [];
      if (m.gender === 'male') {
        const wives = allMembers.filter(
          (w) => w.gender === 'female' && w.generation === m.generation && w.id !== m.id,
        );
        wives.forEach((w) => {
          spouses.push({
            id: w.id,
            fullName: w.fullName,
            gender: w.gender,
            birthDate: w.birthDate,
            avatarUrl: w.avatarUrl,
            isAlive: w.isAlive,
            occupation: w.occupation,
          });
        });
      }

      return {
        id: m.id,
        fullName: m.fullName,
        otherName: m.otherName,
        gender: m.gender,
        birthDate: m.birthDate,
        avatarUrl: m.avatarUrl,
        isAlive: m.isAlive,
        generation: m.generation,
        branch: m.branch,
        occupation: m.occupation,
        spouses,
        children: [],
        isFocusPerson: isFocus,
      };
    };

    // Build recursive children
    const buildChildrenRecursive = (parentId: string): ErgoTreeNode[] => {
      const directChildren = allMembers.filter(
        (m) => (m as any).fatherId === parentId || (m as any).motherId === parentId,
      );

      if (directChildren.length === 0) {
        const parentObj = memberMap.get(parentId);
        if (parentObj) {
          const nextGen = parentObj.generation + 1;
          const inferredChildren = allMembers.filter(
            (m) => m.generation === nextGen && m.id !== parentId,
          );
          return inferredChildren.map((c) => {
            const node = convertNode(c, c.id === focusMemberId);
            node.children = buildChildrenRecursive(c.id);
            return node;
          });
        }
      }

      return directChildren.map((c) => {
        const node = convertNode(c, c.id === focusMemberId);
        node.children = buildChildrenRecursive(c.id);
        return node;
      });
    };

    // Identify root ancestors
    let rootMembers = allMembers.filter((m) => m.generation === 1);
    if (rootMembers.length === 0) {
      rootMembers = [allMembers[0]];
    }

    const rootNodes: ErgoTreeNode[] = rootMembers.map((r) => {
      const node = convertNode(r, r.id === focusMemberId);
      node.children = buildChildrenRecursive(r.id);
      return node;
    });

    return { rootNodes, allMembers };
  } catch (err) {
    console.warn('API buildErgoTreeFromDB error (DB empty or endpoint offline):', err);
    return { rootNodes: [], allMembers: [] };
  }
}
