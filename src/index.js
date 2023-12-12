import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import Login from './pages/login';
import Profile from './pages/profile';
import Edit from './pages/edit';
import Inbox from './pages/inbox';
import View404 from './pages/404';

import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next'
import { ApiErrorProvider, AuthProvider, PageProvider, PostProvider } from './context/datacontext';
import { APIErrorModal } from './components/ApiErrorModal/ApiErrorModal';
import Explore from './pages/explore';
import ExplorePeople from './pages/explorePeople';
import PostWindow, { SharingPostWindow, LoginWindow } from './components/Base/PostWindow/postWindow';
import { Provider } from 'react-redux';
import store from './context/store';
import ResetPasswordForm from './pages/password-reset';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      es: {
        translation: {
          "Create a new post": "Crea una nueva publicación"
        }
      }
    },

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });

ReactDOM.render(

  <BrowserRouter>
    <Provider store={store}>
      <AuthProvider>
        <ApiErrorProvider>
          <PostProvider>
            <PageProvider>

              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/password-reset" element={<ResetPasswordForm />} />
                <Route path="/" element={<Home />} />
                <Route path="/:username" element={<Profile />} />
                <Route path="/edit" element={<Edit />} />
                <Route path="/:username/:tab" element={<Profile />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/explore/people" element={<ExplorePeople />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/inbox/:username" element={<Inbox />} />
                <Route path="/accounts" element={<Inbox />} />
                <Route path="*" element={<View404 />} />
              </Routes>
              <APIErrorModal></APIErrorModal>
              <PostWindow></PostWindow>
              <SharingPostWindow></SharingPostWindow>
              <LoginWindow></LoginWindow>
                           
            </PageProvider>
          </PostProvider>
        </ApiErrorProvider>
      </AuthProvider>
    </Provider>
  </BrowserRouter>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
