export default function Header({
  theme, toggleTheme, onAddClick, onSettingsClick,
  searchQuery, onSearchChange,
  activeTab, onTabChange,
  stats,
}) {
  const tabs = [
    { id: 'all',       label: 'All',        count: stats.total },
    { id: 'watched',   label: 'Watched',    count: stats.watched },
    { id: 'watching',  label: 'Watching',   count: stats.watching },
    { id: 'watchlist', label: 'Watchlist',  count: stats.watchlist },
    { id: 'liked',     label: 'Liked',      count: stats.liked },
  ]

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__logo" onClick={() => onTabChange('all')} role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onTabChange('all')}>
          <div className="header__logo-icon">
            <i className="fa-solid fa-film" />
          </div>
          <span className="header__logo-text">Cinema<span>List</span></span>
        </div>

        <div className="header__search">
          <i className="fa-solid fa-magnifying-glass header__search-icon" />
          <input
            className="header__search-input"
            type="search"
            placeholder="Search your list…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <div className="header__actions">
          <button
            className="header__icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
          </button>

          <button
            className="header__icon-btn"
            onClick={onSettingsClick}
            title="API Settings"
          >
            <i className="fa-solid fa-gear" />
          </button>

          <button className="header__add-btn" onClick={onAddClick}>
            <i className="fa-solid fa-plus" />
            <span className="btn-text">Add Movie</span>
          </button>
        </div>
      </div>

      <nav className="header__nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            <span className="nav-tab__count">{tab.count}</span>
          </button>
        ))}
      </nav>
    </header>
  )
}
