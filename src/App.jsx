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

      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) {
        throw new Error(userRes.status === 404 ? 'User not found' : 'Error fetching user');
      }
      const user = await userRes.json();
      setUserData(user);


      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      if (!reposRes.ok) {
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">


      <div className={`w-full max-w-lg transition-all duration-500 ${userData ? 'mt-8' : 'mt-[20vh]'}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
          GitHub Repo Fetch
        </h1>

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter GitHub Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-gray-500 shadow-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-lg font-semibold shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
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


          <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl p-8 border border-gray-700 shadow-2xl mb-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={userData.avatar_url}
                alt={`${userData.login} avatar`}
                className="relative w-40 h-40 rounded-full object-cover border-4 border-gray-800 shadow-xl"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">
                {userData.name}
                <span className="text-gray-400 font-normal text-xl ml-2">({userData.login})</span>
              </h2>
              {userData.bio && <p className="text-gray-400 mb-6 max-w-2xl">{userData.bio}</p>}

              <div className="flex flex-wrapjustify-center md:justify-start gap-6 select-none">
                <div className="flex flex-col items-center p-3 bg-gray-900/50 rounded-lg min-w-[100px] border border-gray-700 hover:border-emerald-500/50 transition-colors">
                  <span className="text-2xl font-bold text-white">{userData.public_repos}</span>
                  <span className="text-sm text-gray-400 uppercase tracking-wider">Repos</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-900/50 rounded-lg min-w-[100px] border border-gray-700 hover:border-emerald-500/50 transition-colors">
                  <span className="text-2xl font-bold text-white">{userData.followers}</span>
                  <span className="text-sm text-gray-400 uppercase tracking-wider">Followers</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-900/50 rounded-lg min-w-[100px] border border-gray-700 hover:border-emerald-500/50 transition-colors">
                  <span className="text-2xl font-bold text-white">{userData.following}</span>
                  <span className="text-sm text-gray-400 uppercase tracking-wider">Following</span>
                </div>
              </div>
            </div>

            <a
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors text-sm font-medium whitespace-nowrap"
            >
              View on GitHub ↗
            </a>
          </div>


          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
            Repositories <span className="text-gray-500 text-lg font-normal">({repos.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-6 bg-gray-800/40 hover:bg-gray-800 rounded-2xl border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-bold text-emerald-400 group-hover:text-emerald-300 truncate pr-2">
                    {repo.name}
                  </h4>
                  <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 border border-gray-600">
                    {repo.visibility}
                  </span>
                </div>

                <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                  {repo.description || 'No description provided.'}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-700/50">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    ⭐ {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    🍴 {repo.forks_count}
                  </span>
                  <span className="ml-auto">
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
