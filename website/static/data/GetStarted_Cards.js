export const GetStarted_Cards = [
  {
    title: "Manual / Local Download",
    description: "Use the tarball to install Presto manually",
    buttonText: "presto-server-"+presto_latest_presto_version+".tar.gz",
    buttonLink:
      "https://repo1.maven.org/maven2/com/facebook/presto/presto-server/"+presto_latest_presto_version+"/presto-server-"+presto_latest_presto_version+".tar.gz",
    footer:
      'Visit <a href="https://prestodb.io/docs/current/installation/deployment.html" target="_blank">Deploying Presto</a> for deployment instructions.',
  },
  {
    title: "Command Line Interface",
    description: "Run queries using the CLI",
    buttonText: "presto-cli-"+presto_latest_presto_version+"-executable.jar",
    buttonLink:
      "https://repo1.maven.org/maven2/com/facebook/presto/presto-cli/"+presto_latest_presto_version+"/presto-cli-"+presto_latest_presto_version+"-executable.jar",
    footer:
      'A CLI for running queries is available see <a href="https://prestodb.io/docs/current/installation/cli.html" target="_blank">Command Line Interface.</a>',
  },
  {
    title: "JDBC Driver",
    description: "Connect to Presto from Java",
    buttonText: "presto-jdbc-"+presto_latest_presto_version+".jar",
    buttonLink:
      "https://repo1.maven.org/maven2/com/facebook/presto/presto-jdbc/"+presto_latest_presto_version+"/presto-jdbc-"+presto_latest_presto_version+".jar",
    footer:
      'Visit the <a href="https://prestodb.io/docs/current/installation/jdbc.html" target="_blank">JDCB Driver docs</a>',
  },
  {
    title: "Docker Presto Sandbox Container",
    description: "Includes the Presto-cli, JMX, memory, TPC-DS, <span style='white-space:nowrap'>and TPC-H.</span>",
    buttonText: "Docker Presto sandbox",
    buttonLink:
      "https://hub.docker.com/r/ahanaio/prestodb-sandbox",
    footer:
      'See <a href="https://ahana.io/videos-presentations/demo-getting-started/?utm_source=prestodb&utm_medium=getting-started&utm_campaign=docker#docker" target="_blank">demo</a> to get started',
  },
  {
    title: "SaaS for Presto on AWS by Ahana",
    description: "Easily run Presto clusters free-forever in your AWS VPC with the Ahana Cloud Managed Service for&nbsp;Presto.",
    buttonText: "Get Started",
    buttonLink:
      "https://ahana.io/get-started/?utm_source=prestodbio&utm_medium=community&utm_campaign=get_started",
    footer:
      'See a 6min <a href="https://www.youtube.com/watch?v=B8V7e3JWLVc&list=PLJVeO1NMmyqXHoLuUJtulMDU0yBgSL0GH&index=4&ab_channel=PrestoFoundation" target="_blank">demo</a> to get started',
  },
];
