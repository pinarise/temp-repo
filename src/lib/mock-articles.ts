import type { Article } from "@/types/article";
import { IMG } from "@/constants/data";

const mockArticles: Record<string, Article> = {
  "super-eagles-win-afcon-qualifier-1": {
    id: "1",
    title: "Super Eagles Win AFCON Qualifier",
    slug: "super-eagles-win-afcon-qualifier-1",
    excerpt: "Nigeria secures crucial victory in African Cup of Nations qualifying round with impressive performance.",
    content: `
      <p>The Super Eagles of Nigeria secured a crucial 2-1 victory against their opponents in the AFCON qualifying round, bringing joy to millions of Nigerian football fans across the continent.</p>
      
      <h2>First Half Performance</h2>
      <p>Nigeria started the match with high intensity, pressing from the opening whistle. The team's midfield controlled the tempo of the game, creating several opportunities in the first 30 minutes. A brilliant through ball from the captain found the striker in a one-on-one situation, resulting in the opening goal after just 15 minutes.</p>
      
      <h2>Second Half Drama</h2>
      <p>The opposition came out stronger in the second half and equalized within minutes of the restart. However, Nigeria's resilience and determination were evident as they continued to push forward. A stunning free-kick from the left flank in the 78th minute sealed the victory for the Eagles.</p>
      
      <h2>Match Statistics</h2>
      <p>Nigeria dominated possession with 65% of the ball and created 12 clear-cut chances throughout the match. The defense was solid, with only 3 shots on target from the opposition. This victory brings Nigeria closer to qualification for the next AFCON tournament.</p>
      
      <h2>Road Ahead</h2>
      <p>The Eagles will now face their toughest test in the next qualifying match against continental rivals. Coach Eric Chelle has praised the team's fighting spirit and commitment to achieving their AFCON qualification goals.</p>
    `,
    featured_media: IMG.player1,
    author: {
      id: "author-1",
      full_name: "John Okafor",
      avatar_url: null,
    },
    category: {
      id: "cat-1",
      name: "Super Eagles",
      slug: "super-eagles",
    },
    published_at: "2025-06-21T10:30:00Z",
    reading_time: 5,
    allow_comments: true,
  },
  "super-eagles-win-afcon-qualifier-2": {
    id: "2",
    title: "Super Eagles Win AFCON Qualifier",
    slug: "super-eagles-win-afcon-qualifier-2",
    excerpt: "Nigeria's second consecutive victory in AFCON qualifiers showcases team cohesion and tactical excellence.",
    content: `
      <p>In a display of football excellence, the Super Eagles of Nigeria achieved their second consecutive victory in the African Cup of Nations qualifying campaign, defeating a formidable opponent with a commanding 3-0 performance.</p>
      
      <h2>Dominant Display</h2>
      <p>From the first whistle, Nigeria asserted their dominance on the pitch. The attacking lineup moved with precision and purpose, creating danger throughout the match. Three goals in the first 45 minutes set the tone for what would be a convincing victory.</p>
      
      <h2>Defensive Solidity</h2>
      <p>Beyond the attacking prowess, Nigeria's defense remained impeccable. The back four and goalkeeper organized themselves brilliantly, ensuring the opposition barely threatened their goal. This defensive stability is crucial for the team's AFCON qualification ambitions.</p>
      
      <h2>Player Performances</h2>
      <p>Individual performances were outstanding across the board. The midfield controlled the game's rhythm, while the forwards demonstrated finishing quality that's been missing in previous campaigns. This victory is a testament to the coaching staff's tactical preparations.</p>
      
      <h2>Looking Forward</h2>
      <p>With two wins in the bag, Nigeria now sits at the top of their qualifying group. The road to AFCON qualification is becoming clearer, and the team's momentum is undeniable.</p>
    `,
    featured_media: IMG.fan1,
    author: {
      id: "author-2",
      full_name: "Chioma Adeyemi",
      avatar_url: null,
    },
    category: {
      id: "cat-1",
      name: "Super Eagles",
      slug: "super-eagles",
    },
    published_at: "2025-06-22T14:15:00Z",
    reading_time: 4,
    allow_comments: true,
  },
  "world-cup-qualifier-eric-chelle-invites-eagles-legends-1": {
    id: "3",
    title: "World Cup Qualifier: Eric Chelle Invites Eagles Legends To Inspire Players",
    slug: "world-cup-qualifier-eric-chelle-invites-eagles-legends-1",
    excerpt: "Coach Eric Chelle brings in legendary Super Eagles players to motivate the current squad ahead of crucial World Cup qualifier.",
    content: `
      <p>In a strategic move to boost morale and inspire the current squad, Super Eagles head coach Eric Chelle has invited legendary players from Nigeria's glorious football history to interact with the team before the crucial World Cup qualifier.</p>
      
      <h2>Bridging Generations</h2>
      <p>The invitation of former captains and iconic figures represents a deliberate effort to bridge the gap between generations. These legends bring invaluable experience and perspective that money cannot buy. Their presence in the camp sends a powerful message about professionalism and excellence.</p>
      
      <h2>Motivational Session</h2>
      <p>During their visit, the legends shared their experiences, struggles, and triumphs with the current players. Stories of international tournaments, legendary performances, and the honor of representing Nigeria were shared in intimate settings with the squad.</p>
      
      <h2>Impact on Team Morale</h2>
      <p>The interaction has visibly boosted team morale and confidence. Players spoke passionately about the weight of the Super Eagles jersey and the responsibility they carry to their nation. This psychological preparation is as important as any tactical training.</p>
      
      <h2>World Cup Ambitions</h2>
      <p>As Nigeria prepares for the World Cup qualifier, having this support system in place could make the difference. The team is now not just playing for themselves, but for the legacy of Nigerian football and the legacy of these legendary players.</p>
    `,
    featured_media: IMG.team,
    author: {
      id: "author-3",
      full_name: "Ahmed Hassan",
      avatar_url: null,
    },
    category: {
      id: "cat-2",
      name: "World Cup",
      slug: "world-cup",
    },
    published_at: "2025-06-23T09:45:00Z",
    reading_time: 6,
    allow_comments: true,
  },
};

export function getMockArticle(slugOrId: string): Article | null {
  // First try to find by slug
  if (mockArticles[slugOrId]) {
    return mockArticles[slugOrId];
  }
  
  // Then try to find by id
  const article = Object.values(mockArticles).find(
    (article) => article.id === slugOrId || article.slug === slugOrId
  );
  
  return article || null;
}

export function getAllMockArticles(): Article[] {
  return Object.values(mockArticles);
}
