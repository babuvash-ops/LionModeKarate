export default function StudentForm({ student, onSubmit, onCancel, isLoading }: any) {
  return (
    <div className="p-4 text-center text-muted-foreground">
      Student form placeholder.
      <br/>
      <button onClick={() => onCancel()} className="mt-4 px-4 py-2 bg-secondary rounded">Cancel</button>
    </div>
  );
}
