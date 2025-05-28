import React, { useEffect, useState } from 'react';
import './App.css'; 

type Story = {
  id: number;
  title: string;
  url?: string;
  by: string;
};

const categoryMap = {
  top: 'topstories',
  new: 'newstories',
  best: 'beststories',
} as const;

type Category = keyof typeof categoryMap;

export default function NewsApp() {
  const [activeTab, setActiveTab] = useState<Category>('top');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://hacker-news.firebaseio.com/v0/${categoryMap[activeTab]}.json`
        );
        const ids = await res.json();
        const top10 = ids.slice(0, 10);

        const storyData = await Promise.all(
          top10.map(async (id: number) => {
            const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            return res.json();
          })
        );

        setStories(storyData);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [activeTab]);

  return (
    <div className="App">
      <h1>Hacker News</h1>
      <div className="tabs">
        {(['top', 'new', 'best'] as Category[]).map((key) => (
          <button
            key={key}
            className={activeTab === key ? 'active' : ''}
            onClick={() => setActiveTab(key)}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="story-list">
          {stories.map((story) => (
            <li key={story.id}>
              <a
                href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {story.title}
              </a>
              <p>by {story.by}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
