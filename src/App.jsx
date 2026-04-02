import { useState } from 'react';
import './index.css';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setUserData(null);
    setRepos([]);

    try {

      const headers = {};
      if (import.meta.env.VITE_GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`;
      }

      const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
      if (!userRes.ok) {
        if (userRes.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        throw new Error(userRes.status === 404 ? 'User not found' : 'Error fetching user');
      }
      const user = await userRes.json();
      setUserData(user);


      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers });
      if (!reposRes.ok) {
        if (reposRes.status === 403) {
          throw new Error('GitHub API rate limit exceeded while fetching repositories.');
        }
        throw new Error('Error fetching repositories');
      }
      const reposData = await reposRes.json();
      setRepos(reposData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-white">


      <div className={`w-full max-w-lg transition-all duration-500 ${userData ? 'mt-8' : 'mt-[20vh]'}`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          GitHub Repo Fetch
        </h1>

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter GitHub Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-gray-500 shadow-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-lg font-semibold shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {loading ? 'Searching...' : 'Pull User Data'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-center animate-pulse">
            {error}
          </div>
        )}
      </div>


      {userData && (
        <div className="w-full max-w-5xl mt-12 animate-fade-in-up pb-12">


          <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-700 shadow-2xl mb-12 flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full overflow-hidden">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={userData.avatar_url}
                alt={`${userData.login} avatar`}
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-800 shadow-xl"
              />
            </div>

            <div className="flex-1 text-center md:text-left min-w-0 w-full">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
                {userData.name}
                <span className="text-gray-400 font-normal text-lg sm:text-xl ml-2 block sm:inline-block break-all">({userData.login})</span>
              </h2>
              {userData.bio && <p className="text-gray-400 mb-6 max-w-2xl text-sm sm:text-base">{userData.bio}</p>}

              <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 select-none w-full">
                <div className="flex flex-col items-center p-3 bg-gray-900/50 rounded-lg flex-1 sm:flex-none min-w-[90px] sm:min-w-[100px] border border-gray-700 hover:border-cyan-500/50 transition-colors">
                  <span className="text-xl sm:text-2xl font-bold text-white">{userData.public_repos}</span>
                  <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">Repos</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-900/50 rounded-lg flex-1 sm:flex-none min-w-[90px] sm:min-w-[100px] border border-gray-700 hover:border-cyan-500/50 transition-colors">
                  <span className="text-xl sm:text-2xl font-bold text-white">{userData.followers}</span>
                  <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">Followers</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-900/50 rounded-lg flex-1 sm:flex-none min-w-[90px] sm:min-w-[100px] border border-gray-700 hover:border-cyan-500/50 transition-colors">
                  <span className="text-xl sm:text-2xl font-bold text-white">{userData.following}</span>
                  <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">Following</span>
                </div>
              </div>
            </div>

            <a
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto text-center px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors text-sm font-medium whitespace-nowrap shrink-0"
            >
              View on GitHub ↗
            </a>
          </div>


          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
            Repositories <span className="text-gray-500 text-lg font-normal">({repos.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-6 bg-gray-800/40 hover:bg-gray-800 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-bold text-cyan-400 group-hover:text-cyan-300 truncate pr-2">
                    {repo.name}
                  </h4>
                  <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 border border-gray-600">
                    {repo.visibility}
                  </span>
                </div>

                <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                  {repo.description || 'No description provided.'}
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-700/50">
                  {repo.language && (
                    <span className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1 shrink-0">
                    ⭐ {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    🍴 {repo.forks_count}
                  </span>
                  <span className="ml-auto shrink-0">
                    {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {repos.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
              No repositories found for this user.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
