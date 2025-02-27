export default function DashboardMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full flex flex-col text-gray-500 overflow-hidden pt-[200px] md:pt-10 px-8">
            <div className="flex flex-row items-center justify-center font-semibold text-center">{children}</div>
        </div>
    );
}
