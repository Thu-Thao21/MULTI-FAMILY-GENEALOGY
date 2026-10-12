import { getTreeData } from './genealogyService';
import type { Member } from '../types/member';
import type { ErgoTreeNode, SpouseNode } from '../types/tree';
import type { TreeNodeDto } from '../types/sprint2';

const PARENT_TYPES = new Set(['PARENT', 'FATHER', 'MOTHER', 'ADOPTIVE_PARENT', 'STEP_PARENT']);

function toMember(node: TreeNodeDto, familyId: string): Member {
  return {
    id: node.id,
    familyId,
    fullName: node.fullName,
    gender: node.gender,
    isAlive: true,
    branch: node.branchId || undefined,
    generation: node.generation,
    avatarUrl: node.avatarUrl || undefined,
    status: node.status,
  };
}

export async function buildErgoTreeFromDB(
  familyId: string,
  focusMemberId?: string,
): Promise<{ rootNodes: ErgoTreeNode[]; allMembers: Member[] }> {
  if (!familyId) return { rootNodes: [], allMembers: [] };

  const tree = await getTreeData(familyId);
  const nodeMap = new Map(tree.nodes.map((node) => [node.id, node]));
  const childrenByParent = new Map<string, string[]>();
  const incomingParent = new Set<string>();
  const spousesByPerson = new Map<string, SpouseNode[]>();

  const addSpouse = (personId: string, spouseId: string) => {
    const spouse = nodeMap.get(spouseId);
    if (!spouse) return;
    const rows = spousesByPerson.get(personId) || [];
    if (!rows.some((row) => row.id === spouse.id)) {
      rows.push({
        id: spouse.id,
        fullName: spouse.fullName,
        gender: spouse.gender,
        avatarUrl: spouse.avatarUrl || undefined,
        isAlive: true,
      });
    }
    spousesByPerson.set(personId, rows);
  };

  for (const edge of tree.edges) {
    if (PARENT_TYPES.has(edge.relationshipType)) {
      const children = childrenByParent.get(edge.fromMemberId) || [];
      if (!children.includes(edge.toMemberId)) children.push(edge.toMemberId);
      childrenByParent.set(edge.fromMemberId, children);
      incomingParent.add(edge.toMemberId);
    } else if (edge.relationshipType === 'SPOUSE') {
      addSpouse(edge.fromMemberId, edge.toMemberId);
      addSpouse(edge.toMemberId, edge.fromMemberId);
    }
  }

  const buildNode = (personId: string, visited: Set<string>): ErgoTreeNode | null => {
    const person = nodeMap.get(personId);
    if (!person || visited.has(personId)) return null;
    const nextVisited = new Set(visited).add(personId);
    return {
      id: person.id,
      fullName: person.fullName,
      gender: person.gender,
      avatarUrl: person.avatarUrl || undefined,
      isAlive: true,
      generation: person.generation,
      branch: person.branchId || undefined,
      spouses: spousesByPerson.get(person.id) || [],
      children: (childrenByParent.get(person.id) || [])
        .map((childId) => buildNode(childId, nextVisited))
        .filter((child): child is ErgoTreeNode => child !== null),
      isFocusPerson: person.id === focusMemberId,
    };
  };

  const rootIds = focusMemberId && nodeMap.has(focusMemberId)
    ? [focusMemberId]
    : tree.nodes.filter((node) => !incomingParent.has(node.id)).map((node) => node.id);
  const fallbackIds = rootIds.length > 0 ? rootIds : tree.nodes.slice(0, 1).map((node) => node.id);

  return {
    rootNodes: fallbackIds
      .map((rootId) => buildNode(rootId, new Set()))
      .filter((node): node is ErgoTreeNode => node !== null),
    allMembers: tree.nodes.map((node) => toMember(node, familyId)),
  };
}
