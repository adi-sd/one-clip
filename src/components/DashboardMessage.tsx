export default function DashboardMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full flex flex-col text-gray-500 overflow-hidden pt-10">
            <div className="flex flex-row items-center justify-center font-semibold">{children}</div>
        </div>
    );
}
