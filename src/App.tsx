import {Routes, Route } from 'react-router-dom';
import { Login, Signup } from './_auth/pages';
import PublicLayout from './_auth/PublicLayout';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
import PrivateLayout from './_root/PrivateLayout';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <main>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={'/login'} element={<Login />}/>
          <Route path={'/register'} element={<Signup />}/>
        </Route>
        <Route element={<PrivateLayout />}>
          <Route index element={<Home />}/>
          <Route path="/explore" element={<Explore/>} />
          <Route path="/saved" element={<Saved/>} />
          <Route path="/all-user" element={<AllUsers/>} />
          <Route path="/create-post" element={<CreatePost/>} />
          <Route path="/update-post/:id" element={<EditPost/>} />
          <Route path="/posts/:id" element={<PostDetails/>} />
          <Route path="/profile/:id/*" element={<Profile/>} />
          <Route path="/update-profile/:id" element={<UpdateProfile/>} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  )
}

export default App
