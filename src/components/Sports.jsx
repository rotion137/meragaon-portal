import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Sports.css';

const Sports = () => {
  const [games, setGames] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSportsData = async () => {
      try {
        const { data: gamesData } = await supabase.from('karmha_upcoming_games').select('*').order('id', { ascending: false });
        const { data: infraData } = await supabase.from('karmha_infrastructure').select('*').order('id');
        const { data: playersData } = await supabase.from('karmha_star_players').select('*').order('id');

        if (gamesData) setGames(gamesData);
        if (infraData) setInfrastructure(infraData);
        if (playersData) setPlayers(playersData);
      } catch (error) {
        console.error("Error fetching sports data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSportsData();
  }, []);

  if (loading) return <div className="sports-loading">Loading Sports Data...</div>;

  return (
    <div className="google-sports-container">
      <div className="sports-page-header">
        <h1>Sports & Youth</h1>
        <p>Discover upcoming tournaments, local facilities, and our village athletes.</p>
      </div>

      {/* --- SECTION 1: UPCOMING GAMES (Hero Block) --- */}
      <div className="sports-section">
        <h2 className="sports-section-title">Upcoming Games</h2>
        {games.map((game) => (
          <div key={game.id} className="google-sports-hero">
            <div className="hero-image-bg" style={{ backgroundImage: `url(${game.image_url})` }}></div>
            <div className="hero-overlay">
              <span className="hero-badge">{game.sport}</span>
              <h3 className="hero-title">{game.title}</h3>
              <div className="hero-details">
                <p><strong>Dates:</strong> {game.dates}</p>
                <p><strong>Entry Fee:</strong> {game.entry_fee}</p>
                <p><strong>Prizes:</strong> {game.prizes}</p>
                <p className="hero-terms"><em>{game.terms}</em></p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- SECTION 2: SPORTS INFRASTRUCTURE --- */}
      <div className="sports-section">
        <h2 className="sports-section-title">Sports Infrastructure</h2>
        <div className="infra-grid">
          {infrastructure.map((infra) => (
            <div key={infra.id} className="infra-card">
              <div className="infra-image-bg" style={{ backgroundImage: `url(${infra.image_url})` }}></div>
              <div className="infra-overlay">
                <span className="infra-badge">{infra.type}</span>
                <h4 className="infra-name">{infra.name}</h4>
                <p className="infra-desc">{infra.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 3: STAR PLAYERS TABLE --- */}
      <div className="sports-section">
        <h2 className="sports-section-title">Star Players</h2>
        <div className="google-table-container">
          <table className="google-sports-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Sports Played</th>
                <th>Major Tournaments / Games</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id}>
                  <td className="table-photo-cell">
                    <div className="player-avatar">
                      {player.photo_url ? <img src={player.photo_url} alt={player.name} /> : <span>👤</span>}
                    </div>
                  </td>
                  <td className="table-name-cell">{player.name}</td>
                  <td>
                    <ul className="table-list">
                      {player.sports_played && player.sports_played.map((sport, idx) => (
                        <li key={idx}>{sport}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul className="table-list">
                      {player.major_tournaments && player.major_tournaments.map((tourney, idx) => (
                        <li key={idx}>{tourney}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Sports;