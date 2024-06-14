
import React, { useEffect } from 'react'
import './App.module.scss';
import useDialogStore from './stores/dialogStore';
import Footer from './components/common/Footer';

import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Main from './components/common/Main';
import Header from './components/common/Header';
import Dialog from './components/modal/Dialog';
import ChatRoom from './components/chat/ChatRoom';
// [TODO] 로딩 컴포넌트
import useStatusStore from './stores/statusStore';
import Loading from './components/common/Loading';
import useMovePath from './hooks/useMovePath';
import MapPage from './pages/map/MapPage';
import Redirection from './components/common/Redirection';
import ChatPage from './pages/chat/ChatPage';
import JoinPage from './pages/auth/JoinPage';
import LoginPage from './pages/auth/LoginPage';
import BoardPage from './pages/board/BoardPage';
import BoardBasic from './components/board/BoardBasic';
import BoardSubtle from './components/board/BoardSubtle';

import SurveyPage from './pages/survey/SurveyPage';
import SurveyDetail from './components/survey/SurveyDetail';
import SurveyList from './components/survey/SurveyList';
import EtcPage from './pages/Etc/EtcPage';
export default function App() {
  const { isOpen } = useDialogStore();
  const { code, path, setStatus, loading } = useStatusStore();
  const movePath = useMovePath(code, path);

  // 에러 컨트롤
  useEffect(() => {
    if (code && path) {
      movePath();
      setStatus(null);
    }
  }, [code, path]);

  // [TODO] 같은 도메인일시 유저
  useEffect(() => {
  }, [])

  return (
    <>
      <Header />
      <Main>
        {/* <ul className='w-full bg-gray-700 text-white p-8 flex gap-2 justify-evenly'>
          {category.board.map((el, i) => {
            return (
              <CateList id={el.cateId} name={el.name} key={i} />
            )
          })}
        </ul> */}
        {loading ?
          <Loading />
          :
          <Routes>
            <Route index element={<Home />} />

            <Route exact path='/login' element={<LoginPage />} />
            <Route exact path='/register' element={<JoinPage />} />

            {/* 채팅 */}
            <Route exact path="/chat/*" element={<ChatPage />}>
              <Route path="chatRoom/:roomId" element={<ChatRoom />} />
            </Route>

            {/* 지도 */}
            <Route exact path="/map" element={<MapPage />} />

            {/* 카카오 리다이렉션 */}
            <Route exact path='/auth/:kakaoCode' element={<Redirection />} />
            {/* 게시판 */}
            <Route path='/board/*' element={<BoardPage />}>
              <Route index element={<BoardBasic />} />
              <Route path='basic' element={<BoardBasic />} />
              <Route path='subtle' element={<BoardSubtle />} />
            </Route>

            {/* 설문 */}
            <Route path='/survey/*' element={<SurveyPage />}>
              <Route index element={<SurveyList />} />
              <Route exact path=':id' element={<SurveyDetail />} />
            </Route>

            {/* Etc */}
            <Route path='/etc/*' element={<EtcPage />}>
            </Route>
          </Routes>
        }
      </Main >
      <Footer />
      {
        isOpen &&
        <Dialog />
      }
    </>
  )
}
