export default function MemberList({ members }: { members: any[] }) {
  return (
    <div className="space-y-2 flex">
      {members.map((m, i) => (
        <div key={i} className="flex items-center gap-3">
          <img src={m.avatar} className="w-8 h-8 rounded-full object-cover" />
        </div>
      ))}

      {members.length === 0 && (
        <div className="text-sm text-gray-500">Belum ada anggota</div>
      )}
    </div>
  );
}
