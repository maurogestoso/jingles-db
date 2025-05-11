import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Play as IconPlay } from "lucide-react";

export default function SongCard({
  song,
}: {
  song: {
    name: string;
    artist: string;
    author: string | null;
    youtubeUrl: string;
    tags?: string[];
  };
}) {
  return (
    <article>
      <Card className="border-blue-800">
        <CardContent className="flex flex-row items-center justify-between">
          <div>
            <p className="text-lg font-bold leading-none mb-2">{song.name}</p>
            <p className="text-md leading-none mb-2">{song.artist}</p>
            <p className="text-md leading-none">
              por {song.author || "Anónimo"}
            </p>
            <div className="flex gap-2 mt-4">
              {song.tags && song.tags.map((tag) => <Badge>{tag}</Badge>)}
            </div>
          </div>
          <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-red-600 hover:bg-red-700 cursor-pointer rounded-full text-center">
              <IconPlay /> Jingle!
            </Button>
          </a>
        </CardContent>
      </Card>
    </article>
  );
}
