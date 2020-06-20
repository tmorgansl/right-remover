import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/Delete';

import {
  Avatar, Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function PropertyList({properties, removeProperty}) {
  const classes = useStyles();

  if (Object.keys(properties).length == 0) {
    return <Container fixed>Nothing to see here!</Container>
  }

  return (
      <List dense className={classes.root}>
        {Object.keys(properties).map((id) => {
          const labelId = `checkbox-list-secondary-label-${id}`;
          const property = properties[id];
          return (
            <ListItem key={id} button
              onClick={() => window.open(property.url)}
            >
              <ListItemAvatar>
                <Avatar
                  alt={`House ${id}`}
                  src={property.imgUrl}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={property.address} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => removeProperty(id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
  );
}

export default PropertyList;
