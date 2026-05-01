const agents = [
    {
        name: 'Elena Vance',
        role: 'Strategic Accounts',
        vol: '$2.4M',
        eff: '94%',
        effBg: 'bg-tertiary',
        trendIcon: 'show_chart',
        trendColor: 'text-tertiary',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM_IOSazCHswFn-uCY7ObeqMlpxfRnvLq9q6s9W9BB48HfBuU5utL950L_K-szkKSCD7qxh5YtOvBxVX4KqwxSjEpBnBt2pUeA5PtvpFsOntu6TSnxO7igZMWSgbb7dPufhsQV7QRrurMgVWO2iaBHSZ4w3UOwfcqAQXYP2xkfBWulAD7lTw9YaoD8501JPeNT64ygQoTpJL3DHI2jfdrAb_uFeZkqVRrOs0er5ezqzW73qEyxGh9hQMAffP7nAnjrfK0_JOJXL1_7'
    },
    {
        name: 'Marcus Thorne',
        role: 'Global Enterprise',
        vol: '$1.9M',
        eff: '88%',
        effBg: 'bg-tertiary',
        trendIcon: 'show_chart',
        trendColor: 'text-tertiary',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1QLlrW6bfgiMRk9NmtXPpl_x9xJ71HDOWG9hdXCr_dTPapXdfkq_CCjdLt15ydtJ0TUnxCBavV-MY4raQ00KFLGKeuVVGO_AopGq47JpPdtziEXxrtVBMMtPxxUlCgKHnpQuwZ_6vswgYoSnq2Dfr7VxUUPl-keu4eNlpzHgipVZLP9Al2UmEfXtVECzNKadjd8BQ57tfv6Te4c_a9Q3xDEVMVjMYKbD9vvLIzVgrmlMlukOYu3LbRRpEKhEaT22EZVtjBU9vkmUm'
    },
    {
        name: 'Sarah Jenkins',
        role: 'SME Division',
        vol: '$1.2M',
        eff: '72%',
        effBg: 'bg-secondary',
        trendIcon: 'trending_flat',
        trendColor: 'text-on-surface-variant',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdrdhcYiRnVP57gehS6szPCYe233Gi5PKY3QaGtF1T2IB7Ht1h29a4glMncJq5RT7VjHvriqEIOM_oZA8BpX2ax3ChRGJN3HnUfqmPdJ_gJZZG0J86TTR8OUGf3N5M0t_n_TyCWH3PHrziYyxJ4GuDpUBApVaVgXGoJnssoOA27m8lGI9sZCLL7ePki_Aa8qXqCWoFMSj0XbI9YQRlGDyawi73LfUvD0bIyd4xdxpTlVVRluqH0Z1Shz-nDpQkCW6QqMSb6HQ3IbmX'
    }
];

export default function AgentsTable() {
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-headline font-bold">Top Performing Agents</h4>
                <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-surface-container-lowest text-on-surface-variant uppercase text-[10px] tracking-widest">
                            <th className="py-4 px-4 rounded-l-xl">Agent</th>
                            <th className="py-4 px-4">Sales Vol</th>
                            <th className="py-4 px-4">Efficiency</th>
                            <th className="py-4 px-4 rounded-r-xl">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {agents.map((agent, i) => (
                            <tr key={i} className="hover:bg-surface-container-high transition-colors group">
                                <td className="py-5 px-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container">
                                        <img alt="Agent" src={agent.img}/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{agent.name}</p>
                                        <p className="text-[10px] text-on-surface-variant">{agent.role}</p>
                                    </div>
                                </td>
                                <td className="py-5 px-4 text-sm font-headline tabular-nums">{agent.vol}</td>
                                <td className="py-5 px-4">
                                    <div className="w-24 bg-surface-container-highest h-1 rounded-full overflow-hidden">
                                        <div className={`${agent.effBg} h-full`} style={{ width: agent.eff }}></div>
                                    </div>
                                </td>
                                <td className={`py-5 px-4 ${agent.trendColor}`}>
                                    <span className="material-symbols-outlined" data-icon={agent.trendIcon}>{agent.trendIcon}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
