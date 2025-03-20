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
  };
}) {
  return (
    <article>
      <Card className="flex flex-row items-center justify-between border-blue-800">
        <CardHeader className="flex-1">
          <CardTitle>
            <p className="text-lg font-bold leading-none mb-1">{song.name}</p>
            <p className="text-md leading-none">{song.artist}</p>
          </CardTitle>
          <CardDescription>por {song.author || "Anónimo"}</CardDescription>
        </CardHeader>
        <CardContent>
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
