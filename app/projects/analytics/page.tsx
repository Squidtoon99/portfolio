const Analytics = () => {
    return <iframe
        style={{
            position: "fixed",
            left: 0,
            bottom: 0,
            right: 0, 
            width: "100%",
            height: "99%",
            border: "none",
            margin: 0,
            padding: 0,
            overflow: "hidden"
        }}
        src="https://p.datadoghq.com/sb/6hslvw77ioslx3u0-7bbb19373bf6312f8d853de306410660?theme=dark"
    ></iframe>;
};

export default Analytics;
