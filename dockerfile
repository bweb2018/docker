FROM  node:10

COPY ./ /root/icecream

WORKDIR /root/icecream

RUN yarn global add serve && \
    yarn install

ENTRYPOINT yarn build && \
           serve ./dist -l 8080

EXPOSE 8080