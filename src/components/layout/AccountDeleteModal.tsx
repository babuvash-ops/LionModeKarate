export default function AccountDeleteModal({ open, onOpenChange }: any) {
  if (!open) return null;
  return <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
    <div className="bg-card p-6 rounded-2xl">
      <h2 className="text-xl font-bold">Delete Account</h2>
      <button className="mt-4 px-4 py-2 bg-secondary" onClick={() => onOpenChange(false)}>Close</button>
    </div>
  </div>;
}
