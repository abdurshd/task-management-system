import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav';

export default function DashboardLayout({children}: Readonly<{
    children: React.ReactNode;
    }>) {
    return (
        <div className="flex">
            <Sidebar />
            <div>
                <TopNav />
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
    }
