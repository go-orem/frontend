import IconEdit from "@/app/components/icons/IconEdit";
import IconGear from "@/app/components/icons/IconGear";
import IconLogout from "@/app/components/icons/IconLogout";
import IconProfile from "@/app/components/icons/IconProfile";
import IconReply from "@/app/components/icons/IconReply";
import IconSet from "@/app/components/icons/IconSet";
import IconSuka from "@/app/components/icons/IconSuka";
import React from "react";

function SettingsView() {
  return (
    <div className="container h-screen overflow-y-auto pl-6 pr-6">
      <nav>
        <ul className="align-middle justify-center items-center">
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconProfile />
                <span className="text-sm font-mono font-light text-gray-400">
                  Akun
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconSuka />
                <span className="text-sm font-mono font-light text-gray-400">
                  Dompet
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconEdit />
                <span className="text-sm font-mono font-light text-gray-400">
                  Edit
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconGear />
                <span className="text-sm font-mono font-light text-gray-400">
                  Pengaturan
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconReply />
                <span className="text-sm font-mono font-light text-gray-400">
                  Privasi
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconSuka />
                <span className="text-sm font-mono font-light text-gray-400">
                  Chat
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconSuka />
                <span className="text-sm font-mono font-light text-gray-400">
                  Folder
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconSuka />
                <span className="text-sm font-mono font-light text-gray-400">
                  Bahasa
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconSuka />
                <span className="text-sm font-mono font-light text-gray-400">
                  Penyimpanan
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconSuka />
                <span className="text-sm font-mono font-light text-gray-400">
                  Tampilan
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
            <span className="border-b-[0.1px] border-gray-700 mt-2 mb-3"></span>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconSuka />
                <span className="text-sm font-mono font-light text-gray-400">
                  Whitepaper
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconSuka />
                <span className="text-sm font-mono font-light text-gray-400">
                  Developer
                </span>
              </button>
              <span>
                <IconSet />
              </span>
            </div>
          </li>
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer">
              <button className="flex space-x-4 items-center">
                <IconLogout />
                <span className="text-sm font-mono font-light text-gray-400">
                  Keluar
                </span>
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SettingsView;
