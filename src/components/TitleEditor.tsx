const TitleEditor = ({ title, setTitle }: { title: string; setTitle: (title: string) => void }) => {
    return (
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-full w-full text-xl font-semibold bg-transparent border-none focus:ring-0 focus:outline-none focus:bg-transparent"
        />
    );
};

export default TitleEditor;
