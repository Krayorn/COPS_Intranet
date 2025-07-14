import React from 'react';

interface Group {
  name: string;
  parent: string | null;
  description: string | null;
  leader: {
    name: string;
    title: string;
    rank: string;
  } | null;
  members: string[];
}

interface HierarchyTreeProps {
  groups: Group[];
}

const HierarchyTree: React.FC<HierarchyTreeProps> = ({ groups }) => {
  // Build hierarchy tree
  const buildHierarchy = (groups: Group[]) => {
    // Find root nodes (groups with no parent)
    const rootGroups = groups.filter(group => !group.parent);
    return rootGroups;
  };
  
  const renderGroup = (group: Group, level: number = 0) => {
    const children = groups.filter(g => g.parent === group.name);
    const hasChildren = children.length > 0;
    const hasLeader = group.leader && group.leader.name;
    
    // If no leader and has children, render as container with nested children
    if (!hasLeader && hasChildren) {
      return (
        <div key={group.name} className="mb-6 w-full min-w-0">
          <div 
            className={
              `flex flex-col w-full h-full min-w-0 p-6 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 overflow-hidden`
            }
          >
            {/* Group header */}
            <div className="flex items-center mb-6 w-full min-w-0">
              {/* Group info */}
              <div className="flex-1 min-w-0">
                <a 
                  href={`/groups/${encodeURIComponent(group.name)}`}
                  className="block hover:text-cyan-400 transition-colors duration-200"
                >
                  <h3 className="text-xl font-bold text-white mb-2 hover:text-cyan-400 transition-colors duration-200 truncate">
                    {group.name}
                  </h3>
                </a>
                {group.description && (
                  <p className="text-gray-300 text-sm mb-2 truncate">{group.description}</p>
                )}
                {group.members.length > 0 && (
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>Members: {group.members.length + (group.leader ? 1 : 0)}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Nested children as cards */}
            <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
              {children.map(child => renderGroup(child, level + 1))}
            </div>
          </div>
        </div>
      );
    }
    // Regular group with leader or no children - render as card
    return (
      <div key={group.name} className="flex flex-col w-full h-full min-w-0 bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer overflow-hidden">
        {/* Group info */}
        <div className="w-full min-w-0">
          <a 
            href={`/groups/${encodeURIComponent(group.name)}`}
            className="block hover:text-cyan-400 transition-colors duration-200"
          >
            <h3 className="text-lg font-semibold text-white mb-2 hover:text-cyan-400 transition-colors duration-200 truncate">
              {group.name}
            </h3>
          </a>
          {group.description && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-2 truncate">{group.description}</p>
          )}
          <div className="space-y-1 text-xs text-gray-400">
            {group.leader && (
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">Leader:</span>
                <span>
                  {group.leader.title.charAt(0).toUpperCase() + group.leader.title.slice(1).toLowerCase()} {group.leader.name.split(' ').pop()}
                </span>
              </div>
            )}
            {group.members.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">Members:</span>
                <span>{group.members.length + (group.leader ? 1 : 0)}</span>
              </div>
            )}
          </div>
        </div>
        {/* Render children if any */}
        {hasChildren && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
              {children.map(child => renderGroup(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };
  const rootGroups = buildHierarchy(groups);

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">LAPD Organizational Hierarchy</h2>
        <p className="text-gray-300">Complete organizational structure of the Los Angeles Police Department</p>
      </div>
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 w-full min-w-0">
        {rootGroups.length > 0 ? (
          <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            {rootGroups.map(group => renderGroup(group))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <p>No hierarchy data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyTree; 