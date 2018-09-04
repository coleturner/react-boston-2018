import React from "react";

import {
  Appear,
  Text,
  Fill,
  Layout,
  List,
  ListItem,
  Heading,
  S
} from "spectacle";

export default function Exposition({ withDefinition }) {
  return (
    <Layout>
      <Fill>
        <Heading textColor="focus" caps>
          {withDefinition ? "Per · form · ance" : "Performance"}
        </Heading>
        {withDefinition && (
          <Text textColor="body">
            the capabilities of a machine, vehicle, or product, especially when
            <S textColor="secondary" type="italic">
              {" observed "}
            </S>
            under particular conditions.
          </Text>
        )}
        {!withDefinition && (
          <List>
            <Layout>
              <Fill>
                <ListItem>Time to Render</ListItem>
              </Fill>

              <Fill>
                <ListItem>Time to Interactive</ListItem>
              </Fill>
            </Layout>
          </List>
        )}
      </Fill>
    </Layout>
  );
}
