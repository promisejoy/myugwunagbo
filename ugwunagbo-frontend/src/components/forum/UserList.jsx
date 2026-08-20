import React from 'react';
import { FaUserCircle, FaCircle } from 'react-icons/fa';

const UserList = ({ users, onSelectUser }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <FaCircle className="text-green-500 text-xs" />
        Online Users ({users.length})
      </h4>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser?.(user)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
          >
            <div className="relative">
              <FaUserCircle className="text-2xl text-gray-500" />
              <FaCircle className="absolute -bottom-0.5 -right-0.5 text-green-500 text-xs" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{user.username}</p>
              <p className="text-xs text-gray-400">{user.fullName || ''}</p>
            </div>
          </button>
        ))}
        {users.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No users online</p>
        )}
      </div>
    </div>
  );
};

export default UserList;