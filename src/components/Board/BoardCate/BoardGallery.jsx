import { Link, Route, Routes } from "react-router-dom"
import GalleryGrid from "./Gallery/GalleryGrid"
import GalleryGrid2 from "./Gallery/GalleryGrid2"
import GallerySlide from "./Gallery/GallerySlide"
import GallerySlide2 from "./Gallery/GallerySlide2"

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

            <Routes>
                <Route path="grid" element={<GalleryGrid />} />
                <Route path="grid2" element={<GalleryGrid2 />} />
                <Route path="slide" element={<GallerySlide />} />
                <Route path="slide2" element={<GallerySlide2 />} />
            </Routes>
        </div >
    )
}

export default BoardGallery
