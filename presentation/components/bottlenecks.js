import React from "react";

import { Heading, Layout, Fill, ListItem, List, S } from "spectacle";

export default function Bottlenecks({ index = 0 }) {
  return (
    <div>
      <Heading textColor="focus" size={2}>
        Bottlenecks
      </Heading>
      <List>
        <Layout>
          <Fill>
            <ListItem>
              {index > 0 && (
                <S type="italic" textColor="focus">
                  Reduce
                </S>
              )}{" "}
              DOM mutations
            </ListItem>
            {index > 1 ? (
              <ListItem>
                <S type="italic" textColor="focus">
                  Fixed
                </S>{" "}
                element sizing
              </ListItem>
            ) : (
              <ListItem>Variable element sizing</ListItem>
            )}
          </Fill>
          <Fill>
            {index > 2 ? (
              <ListItem>
                <S type="italic" textColor="focus">
                  Virtual
                </S>{" "}
                rendering
              </ListItem>
            ) : (
              <ListItem>Render Everything</ListItem>
            )}
            {index > 3 ? (
              <ListItem>
                <S type="italic" textColor="focus">
                  Static
                </S>{" "}
                arrangement
              </ListItem>
            ) : (
              <ListItem>Dynamic arrangement</ListItem>
            )}
          </Fill>
        </Layout>
      </List>
    </div>
  );
}
