const TitleEditor = ({ title, setTitle }: { title: string; setTitle: (title: string) => void }) => {
    return (
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold bg-transparent border-none focus:ring-0 focus:outline-none"
        />
    );
};

export default TitleEditor;
