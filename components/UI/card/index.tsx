import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
interface IProps {
  title?: string;
  subtitle: string;
  src: string;
  wayTitle?: string;
}

export const MyCard: React.FC<IProps> = ({
  title,
  subtitle,
  src,
  wayTitle,
}) => {
  return (
    <Card sx={{ width: "33%" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={require(`/public/imgs/${src}`)}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            {wayTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
