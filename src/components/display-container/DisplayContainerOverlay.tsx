export default function DisplayContainerOverlay() {
    return (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-lg flex items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-gray-400">No Note Selected!</span>
        </div>
    );
}
