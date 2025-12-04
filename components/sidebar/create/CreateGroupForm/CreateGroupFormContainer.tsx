"use client";

interface Props {
  children: React.ReactNode;
}

export function CreateGroupFormContainer({ children }: Props) {
  return (
    <div className="relative h-full">
      {/* Scrollable content */}
      <div className="h-full overflow-y-auto px-4 pb-28 scroll-smooth">
        {children}
      </div>

      {/* Floating bottom button */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 ">
        <button
          form="create-group-form"
          type="submit"
          className="btn-primary w-full"
        >
          Create Group
        </button>
      </div>
    </div>
  );
}
