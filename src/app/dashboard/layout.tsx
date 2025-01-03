import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav';

export default function DashboardLayout({children}: Readonly<{
    children: React.ReactNode;
    }>) {
    return (
        <div className="flex w-full">
            <Sidebar />
            <div className="flex flex-col w-full">
                <TopNav />
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
    }
