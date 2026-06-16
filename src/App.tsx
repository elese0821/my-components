
import React, { useEffect } from 'react'
import Footer from './components/common/Footer';

import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import Main from './components/common/Main';
import Dialog from './components/modal/Dialog';
import ChatRoom from './components/chat/ChatRoom';

import MapPage from './pages/map/MapPage';
import Redirection from './components/common/Redirection';
import ChatPage from './pages/chat/ChatPage';
import JoinPage from './pages/auth/JoinPage';
import LoginPage from './pages/auth/LoginPage';
import BoardPage from './pages/board/BoardPage';
import BoardHome from './pages/board/BoardHome';
import BoardBasic from './components/board/BoardBasic';

import SurveyPage from './pages/survey/SurveyPage';
import SurveyDetail from './components/survey/SurveyDetail';
import SurveyList from './components/survey/SurveyList';
import SurveyCreatePage from './pages/survey/SurveyCreatePage';
import EtcPage from './pages/Etc/EtcPage';
import PdfPage from './pages/Etc/PdfPage';
import FormsPage from './pages/Etc/FormsPage';
import PromptPage from './pages/Etc/PromptPage';
import CalendarPage from './pages/calendar/CalendarPage';
import TodoPage    from './pages/todo/TodoPage';
import TablePage    from './pages/table/TablePage';
import TableBasic   from './pages/table/TableBasic';
import TableOrder   from './pages/table/TableOrder';
import TableEdit    from './pages/table/TableEdit';
import TableStats   from './pages/table/TableStats';
import TableCompare from './pages/table/TableCompare';
import ChartPage from './pages/chart/ChartPage';
import BoardFAQ from './components/board/BoardFAQ';
import BoardCard from './components/board/BoardCard';
import BoardBlog from './components/board/BoardBlog';
import BoardGallery from './components/board/BoardGallery';
import BoardGrid from './components/board/BoardGrid';
import useStatusStore from './stores/statusStore';
import useDialogStore from './stores/dialogStore';
import Header from './components/common/Header';
import NotFound from './pages/NotFound';
import Error from './pages/Error';
import MSPage from './pages/Etc/MSPage';
import ASPage from './pages/Etc/ASPage';
import UserInfoPage from './pages/user/UserInfoPage';
import ProjectsPage from './pages/projects/ProjectsPage';

export default function App() {
  const { isOpen } = useDialogStore();
  const { code, path, setStatus } = useStatusStore();
  const navigate = useNavigate();

  // 에러 컨트롤(로그인안하고 서버요청시 홈으로 되돌아감)
  useEffect(() => {
    if (path) {
      navigate(path);
      setStatus(null, null);
    }
  }, [code, path]);

  return (
    <>
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<JoinPage />} />

          {/* 채팅 */}
          <Route path="/chat/*" element={<ChatPage />}>
            <Route path="chatRoom/:roomId" element={<ChatRoom />} />
          </Route>

          {/* 지도 */}
          <Route path="/map" element={<MapPage />} />

          {/* 소셜 로그인 콜백 — /auth/kakao, /auth/naver 모두 처리 */}
          <Route path="/auth/:kakaoCode" element={<Redirection />} />

          {/* 게시판 홈 — 카테고리 선택 랜딩 */}
          <Route path="/board" element={<BoardHome />} />

          {/* 게시판 — 레이아웃 포함 */}
          <Route path="/board/*" element={<BoardPage />}>
            <Route path="basic"   element={<BoardBasic />} />
            <Route path="faq"     element={<BoardFAQ />} />
            <Route path="card"    element={<BoardCard />} />
            <Route path="blog"    element={<BoardBlog />} />
            <Route path="gallery" element={<BoardGallery />} />
            <Route path="grid"    element={<BoardGrid />} />
          </Route>

          {/* 표 */}
          <Route path="/table/*" element={<TablePage />}>
            <Route index element={<Navigate to="basic" replace />} />
            <Route path="basic"   element={<TableBasic />} />
            <Route path="order"   element={<TableOrder />} />
            <Route path="edit"    element={<TableEdit />} />
            <Route path="stats"   element={<TableStats />} />
            <Route path="compare" element={<TableCompare />} />
          </Route>

          {/* 캘린더 */}
          <Route path="/calendar/*" element={<CalendarPage />} />

          {/* 할 일 & 목표 */}
          <Route path="/todo" element={<TodoPage />} />

          {/* 설문 */}
          <Route path="/survey/*" element={<SurveyPage />}>
            <Route index element={<SurveyList />} />
            <Route path="create" element={<SurveyCreatePage />} />
            <Route path=":id" element={<SurveyDetail />} />
          </Route>

          {/* Etc */}
          <Route path="/etc/*" element={<EtcPage />}>
            <Route index element={<Navigate to="forms" replace />} />
            <Route path="pdf" element={<PdfPage />} />
            <Route path="forms" element={<FormsPage />} />
            <Route path="prompt" element={<PromptPage />} />
            <Route path="master-slave" element={<MSPage />} />
            <Route path="add-subtract" element={<ASPage />} />
          </Route>

          {/* 차트 */}
          <Route path="/chart/*" element={<ChartPage />} />

          {/* 프로젝트 쇼케이스 */}
          <Route path="/projects" element={<ProjectsPage />} />

          {/* 마이페이지 */}
          <Route path="/user-info" element={<UserInfoPage />} />

          {/* error 404처리 */}
          <Route path="*" element={<NotFound />} />
          {/* error 500처리 */}
          <Route path="error" element={<Error />} />
        </Routes>
      </Main>
      <Footer />
      {isOpen && <Dialog />}
    </>
  )
}
