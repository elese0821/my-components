const Main = ({ children }) => {
    return (
        <main id='main' role='main'>
            <section className='section__header'>
                <h3 className="font-bold text-7xl tracking-wider">WY</h3>
                <p className="lime">COMPONENTS</p>
            </section>
            <section className="p-8">
                {children}
            </section>
        </main>
    )
}

export default Main