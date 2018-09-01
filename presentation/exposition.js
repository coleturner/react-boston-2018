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
              <Appear>
                <Fill>
                  <ListItem>Time to Render</ListItem>
                </Fill>
              </Appear>

              <Appear>
                <Fill>
                  <ListItem>Time to Interaction</ListItem>
                </Fill>
              </Appear>
            </Layout>
          </List>
        )}
      </Fill>
    </Layout>
  );
}
