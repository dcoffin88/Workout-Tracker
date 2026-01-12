import Layout from './components/Layout';
import { WorkoutProvider } from './components/WorkoutContext';
import { ThemeProvider } from './components/ThemeContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AdminLayout from './admin/AdminLayout';
import AdminExercises from './admin/AdminExercises';
import AdminWorkouts from './admin/AdminWorkouts';
import AdminPin from './admin/AdminPin';

function App() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="exercises" replace />} />
              <Route path="exercises" element={<AdminExercises />} />
              <Route path="workouts" element={<AdminWorkouts />} />
              <Route path="pin" element={<AdminPin />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </WorkoutProvider>
    </ThemeProvider>
  );
}

export default App;
