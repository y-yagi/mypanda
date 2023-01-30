use http_test_server::http::{Method, Status};
use http_test_server::{TestServer};
use yomu_tauri::feed_fetcher::FeedFetcher;

#[tokio::test]
async fn it_works_with_rss() {
    let server = TestServer::new().unwrap();
    let resource = server.create_resource("/rss");
    let body = r#"
        <rss version="2.0">
            <channel>
              <title>RSS</title>
              <link>https://example.com/</link>
              <description>RSS Description</description>
              <item>
                <title>item1</title>
                <link>https://example.com/item1</link>
                <pubDate>Sun, 29 Jan 2023 19:42:30 +0000</pubDate>
                <comments>https://example.com/item1/comments</comments>
                <description>item1 description</description>
              </item>
            </channel>
        </rss>
    "#;

    resource.status(Status::OK).method(Method::GET).body(body);
    let url = format!("http://127.0.0.1:{0}/rss", server.port());
    let v = FeedFetcher::execute(&url).await.unwrap();
    let expected = r#"[{"title":"item1","link":"https://example.com/item1","description":"item1 description","comments":"https://example.com/item1/comments"}]"#;
    assert_eq!(v, expected);
}

#[tokio::test]
async fn it_works_with_atom() {
    let server = TestServer::new().unwrap();
    let resource = server.create_resource("/atom");
    let body = r#"
      <feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
        <title>Atom</title>
        <updated>2023-01-29T18:03:15-05:00</updated>
        <id>https://example.com/atom</id>
        <link type="text/html" href="https://example.com/" rel="alternate"/>
        <entry>
          <published>2023-01-29T18:03:15-05:00</published>
          <updated>2023-01-29T18:03:15-05:00</updated>
          <title>Entry1 title</title>
          <content>Entry1 content</content>
          <link rel="alternate" type="text/html" href="https://example.com/entry1"/>
          <id>https://example.com/entry1"</id>
          <author>
            <name>Entry1 author</name>
          </author>
        </entry>
      </feed>
    "#;

    resource.status(Status::OK).method(Method::GET).body(body);
    let url = format!("http://127.0.0.1:{0}/atom", server.port());
    let v = FeedFetcher::execute(&url).await.unwrap();
    let expected = r#"[{"title":"Entry1 title","link":"https://example.com/entry1","description":"","comments":""}]"#;
    assert_eq!(v, expected);
}

#[tokio::test]
#[should_panic(expected = "Could not parse XML as Atom or RSS from input")]
async fn it_doesnot_work_with_html() {
    let server = TestServer::new().unwrap();
    let resource = server.create_resource("/html");
    let body = r#"<html lang="UTF-8"></html>"#;
    resource.status(Status::OK).method(Method::GET).body(body);
    let url = format!("http://127.0.0.1:{0}/html", server.port());
    FeedFetcher::execute(&url).await.unwrap();
}
