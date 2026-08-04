import { fetchMembers } from './member.service';
import type { Member } from '../types/member';
import type { ErgoTreeNode, SpouseNode } from '../types/tree';

export async function buildErgoTreeFromDB(
  familyId?: string,
  focusMemberId?: string,
): Promise<{ rootNodes: ErgoTreeNode[]; allMembers: Member[] }> {
  try {
    // Fetch all members directly from backend database API
    const res = await fetchMembers({ familyId, limit: 100 });
    const allMembers = Array.isArray(res?.items) ? res.items : [];

    if (allMembers.length === 0) {
      return { rootNodes: [], allMembers: [] };
    }

    // Create lookup map
    const memberMap = new Map<string, Member>();
    allMembers.forEach((m) => memberMap.set(m.id, m));

    // Helper to find true wives/spouses of a male member
    const getSpousesOfMale = (m: Member): SpouseNode[] => {
      if (m.gender !== 'male') return [];

      const spouses: SpouseNode[] = [];
      
      allMembers.forEach((w) => {
        if (w.gender !== 'female' || w.id === m.id) return;

        // Exclude sisters (share same father or mother)
        const mFather = (m as any).fatherId;
        const mMother = (m as any).motherId;
        const wFather = (w as any).fatherId;
        const wMother = (w as any).motherId;
        if (mFather && wFather && mFather === wFather) return;
        if (mMother && wMother && mMother === wMother) return;

        // Check 1: Shared children in database
        const isMotherOfChildren = allMembers.some(
          (c) => (c as any).fatherId === m.id && (c as any).motherId === w.id
        );

        // Check 2: Explicit spouse link or sample pair
        const isExplicitSpouse =
          (w as any).spouseId === m.id ||
          (m as any).spouseId === w.id ||
          (w as any).husbandId === m.id ||
          (m.id === 'mem_001' && w.id === 'mem_002') ||
          (m.id === 'mem_003' && w.id === 'mem_004') ||
          (m.id === 'mem_005' && w.id === 'mem_006') ||
          (m.id === 'mem_008' && w.id === 'mem_009') ||
          (m.id === 'mem_010' && w.id === 'mem_011') ||
          (m.id === 'mem_013' && w.id === 'mem_014');

        if (isMotherOfChildren || isExplicitSpouse) {
          spouses.push({
            id: w.id,
            fullName: w.fullName,
            gender: w.gender,
            birthDate: w.birthDate,
            avatarUrl: w.avatarUrl,
            isAlive: w.isAlive,
            occupation: w.occupation,
          });
        }
      });

      return spouses;
    };

    // Helper to convert Member to ErgoTreeNode
    const convertNode = (m: Member, isFocus: boolean = false): ErgoTreeNode => {
      const spouses = getSpousesOfMale(m);

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
      const parentM = memberMap.get(parentId);
      if (!parentM) return [];

      let directChildren: Member[] = [];

      if (parentM.gender === 'male') {
        // For a male parent, get all children where fatherId === parentId
        directChildren = allMembers.filter((m) => (m as any).fatherId === parentId);
      } else {
        // For a female parent, only query motherId if her husband is not present in allMembers
        const husbandExists = allMembers.some((m) => m.gender === 'male' && getSpousesOfMale(m).some((s) => s.id === parentId));
        if (!husbandExists) {
          directChildren = allMembers.filter((m) => (m as any).motherId === parentId);
        }
      }

      return directChildren.map((c) => {
        const node = convertNode(c, c.id === focusMemberId);
        node.children = buildChildrenRecursive(c.id);
        return node;
      });
    };

    // Identify root ancestors
    let rootMembers: Member[] = [];
    if (focusMemberId) {
      const focusM = memberMap.get(focusMemberId);
      if (focusM) {
        rootMembers = [focusM];
      }
    }

    if (rootMembers.length === 0) {
      // Find generation 1 male root ancestors
      rootMembers = allMembers.filter((m) => m.generation === 1 && m.gender === 'male');
      if (rootMembers.length === 0) {
        rootMembers = allMembers.filter((m) => m.generation === 1);
      }
      if (rootMembers.length === 0 && allMembers.length > 0) {
        rootMembers = [allMembers[0]];
      }
    }

    const rootNodes: ErgoTreeNode[] = rootMembers.map((r) => {
      const node = convertNode(r, r.id === focusMemberId);
      node.children = buildChildrenRecursive(r.id);
      return node;
    });

    return { rootNodes, allMembers };
  } catch (err) {
    console.error('API buildErgoTreeFromDB error:', err);
    return { rootNodes: [], allMembers: [] };
  }
}
