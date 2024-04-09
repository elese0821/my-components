import { VictoryBar, VictoryChart } from 'victory';

const Chart = () => {
    const data = [
        { quarter: 1, earnings: 13000 },
        { quarter: 2, earnings: 16500 },
        { quarter: 3, earnings: 14250 },
        { quarter: 4, earnings: 19000 }
    ];

    return (
        <div className='chart__page'>
            <VictoryBar />
            <VictoryChart>
                <VictoryBar
                    data={data}
                    x="quarter"
                    y="earnings"
                />
            </VictoryChart>
        </div>
    )
}

export default Chart
