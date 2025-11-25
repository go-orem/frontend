import NotifikasiSidebar from "../components/layout/notifikasi/NotifikasiPage";
import SplitView from "../components/layout/view/Page";

export default function Notification() {
  return (
    <>
      <div className="flex h-full">
        <div className="flex-1 bg-[--background]">
          <NotifikasiSidebar />
        </div>
      </div>
    </>
  );
}
