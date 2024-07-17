import { useSearchParams } from 'react-router-dom';
import Profile from '../components/profile';

import './home.css';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams(window.location.search);

  const onChange = (id: string) => {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, profileId: id });
  };

  return (
    <div className="home">
      <Profile id={searchParams.get('profileId')} onChange={onChange} />
    </div>
  );
}

export default Home;
