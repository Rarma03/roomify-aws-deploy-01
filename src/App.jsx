import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import Header from './Header'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import AccountPage from './pages/accountPage'
import PlacesPage from './pages/PlacesPage'
import PlacesFormPage from './pages/PlacesFormPage'
import SinglePlacePage from './pages/SinglePlacePage'
import BookingPage from './pages/BookingPage'
import BookingPlacePage from './pages/BookingPlacePage'
import RentingRequestPage from './pages/RentingRequestPage'
import SearchPage from './pages/SearchPage'
import FlatmatePage from './pages/FlatmatePage'
import ManageFlatmates from './pages/ManageFlatmates'
import CreateFlatmate from './pages/CreateFlatmate'
import CreateFlatmateRequestFormPage from './pages/CreateFlatmateRequestFormPage'
import CheckRequest from './pages/CheckRequest'


axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout></Layout>}>
          <Route index element={<IndexPage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/register' element={<RegisterPage />}></Route>
          <Route path='/account' element={<AccountPage />} />
          <Route path='/account/places' element={<PlacesPage />} />
          <Route path='/account/places/new' element={<PlacesFormPage />} />
          <Route path='/account/places/:id' element={<PlacesFormPage />} />
          <Route path='/place/:id' element={<SinglePlacePage />} />
          <Route path='/account/bookings' element={<BookingPage />} />
          <Route path='/account/bookings/:id' element={<BookingPlacePage />} />
          <Route path='/account/rentingrequest' element={<RentingRequestPage />} />
          <Route path='/account/manageflatmates' element={<ManageFlatmates />} />
          <Route path='/account/manageflatmates/new' element={<CreateFlatmateRequestFormPage />} />
          <Route path='/account/manageflatmates/checkrequest/:id' element={<CheckRequest />} />
          <Route path='/account/manageflatmates/:id' element={<CreateFlatmate />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/flatmates' element={<FlatmatePage />} />
        </Route>
      </Routes >
    </UserContextProvider>
  )
}