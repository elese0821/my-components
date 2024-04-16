import { Link, Outlet } from "react-router-dom"


const BoardGallery = () => {

    const galleryList = [
        {
            path: '/board/gallery/grid',
            title: 'grid'
        },
        {
            path: '/board/gallery/grid2',
            title: 'grid2'
        },
        {
            path: '/board/gallery/slide',
            title: 'slide'
        },
        {
            path: '/board/gallery/slide2',
            title: 'slide2'
        },
    ]

    return (
        <div className="gallery">
            <h2>갤러리형 게시판</h2>

            <ul className="flex gap-4">
                {galleryList.map((item) => (
                    <li key={item.title} className="btn black rounded">
                        <Link to={item.path}>{item.title}</Link>
                    </li>
                ))}
            </ul>

            <Outlet />
        </div >
    )
}

export default BoardGallery
