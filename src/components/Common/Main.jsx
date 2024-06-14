import Category from "./Category"

const Main = ({ children }) => {
    return (
        <main id='main' role='main'>
            <section className='section__header'>
                <div className="title">
                    <h3>WY</h3>
                    <p>COMPONENTS</p>
                </div>
                <div className="absolute bottom-0 w-full">
                    <Category />
                </div>
            </section>
            {children}
        </main>
    )
}

export default Main