import Link from "next/link";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Home() {
    return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <Link href="/dashboard" className="text-4xl font-bold text-center bg-amber-300">
     Cms
     
     </Link>

    </div>
  );
}
