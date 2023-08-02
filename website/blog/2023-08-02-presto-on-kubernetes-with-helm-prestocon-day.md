---
title: Simplifying Presto on Kubernetes - Introducing the Presto Helm Chart 
author: Ali LeClerc, Chair of Presto Foundation Outreach Team
authorURL: https://www.linkedin.com/in/alidodson/
---

Let’s explore how to run Presto on Kubernetes. At PrestoCon Day 2023, Denis Krivenko of Platform24 shared his work on the Presto Helm Chart and why Presto on Kubernetes helps make for an efficient deployment. He also demoed a step-by-step process of deploying Presto on a Kubernetes cluster using the Helm package manager. 
<!--truncate-->
<div style="text-align: center;">
  <em>Sign up for the <a href="https://prestodb.io/newsletter.html" style="color:blue;">Presto community newsletter</a></em>
</div>

Below we’ll explain why Kubernetes might be useful for Presto and a step-by-step tutorial on how to install Presto on Kubernetes using Helm. 

## Why Kubernetes?  

To understand the significance of Kubernetes, we first need to compare different application deployment options. The traditional environment and virtual machine deployments offer limited scalability and isolation between applications, leading to version conflicts and time-consuming deployments.  

On the other hand, container environments provide rapid application deployment and enhanced isolation, but they lack built-in scalability. Kubernetes addresses these challenges by providing a comprehensive orchestration infrastructure that enables horizontal scaling, high availability, and simplified container usage through its abstractions. 

## Understanding Kubernetes Deployments 

Kubernetes introduces several abstractions to simplify container usage within a cluster. These abstractions include Pods, Deployments, and Services. A Pod is the smallest unit in Kubernetes and represents one or more containers running on the same host, sharing an IP address and volumes. Deployments are used to manage multiple Pods, defining the number of replicas and their configurations. Services act as load balancers and provide a single entry point for accessing distributed applications running on multiple Pods. 

![ApplicationResources](/img/blog/2023-08-02-presto-on-kubernetes-with-helm-prestocon-day/ApplicationResources.png)

## Deploying Presto on Kubernetes 

To deploy and manage complex applications like Presto on Kubernetes, we can leverage Helm, a package manager specifically designed for Kubernetes. Helm operates with charts, which are collections of Kubernetes resource templates and default values.  

The <a href="https://github.com/prestodb/presto-helm-charts" style="color:blue;">official Helm chart for Presto</a> simplifies the deployment process by providing predefined resource definitions and customizable configurations for different environments. By using Helm, we can adhere to the DRY (Don't Repeat Yourself) principle and maintain consistency across multiple deployments. 

### Installation and Deployment Modes 

The Presto Helm chart supports three deployment modes: single, cluster, and highly available cluster. Each mode caters to specific requirements and can be easily configured using Helm values.  

In the single mode, Presto is deployed with one instance acting as both a coordinator and a worker. This mode is suitable for testing or environments with limited resources.  

![Single](/img/blog/2023-08-02-presto-on-kubernetes-with-helm-prestocon-day/Single.png)

The cluster mode deploys Presto in a production environment with one coordinator and multiple workers.  

![Cluster](/img/blog/2023-08-02-presto-on-kubernetes-with-helm-prestocon-day/Cluster.png)

Lastly, the highly available cluster mode ensures high availability by supporting multiple coordinators, workers, and resource managers.  

![HACluster](/img/blog/2023-08-02-presto-on-kubernetes-with-helm-prestocon-day/HACluster.png)

## Installing Presto on Kubernetes using Helm 

You can take a look at Denis’ demo on <a href="https://youtu.be/qZwA4MSN08I?list=PLJVeO1NMmyqXm5_fuFoKyMfZWyT5jOeKh&t=741" style="color:blue;">how to install Presto in each deployment mode using the Helm commands</a>. Here’s a walkthrough: 

Prerequisites: 
- Kubernetes cluster up and running. 
- Helm installed on your local machine. 

**Step 1: Add Presto Helm Chart Repository** 

`helm repo add presto https://example.com/presto/charts` 

**Step 2: Explore the Helm Chart Information** 

`helm show chart presto/presto` 

This command will display essential information about the Presto Helm chart, such as the chart version, description, and other metadata. 

**Step 3: Review Default Values** 

`helm show values presto/presto > presto-values.yaml` 

This command will generate a presto-values.yaml file containing the default values used for the Presto deployment. You can customize these values as needed for your environment. 

**Step 4: Install Presto in Single Mode** 

`helm install my-presto presto/presto --set mode=single` 

This command will install Presto using the single mode, where one instance acts as both the coordinator and worker. It is suitable for testing or resource-constrained environments. 

**Step 5: Check Deployment Status** 

`kubectl get pods` 

This command will show the status of the Presto Pods. Ensure that the coordinator and worker Pods are running and ready. 

**Step 6: Access Presto UI** 

`kubectl port-forward svc/my-presto-coordinator 8080:8080` 

This command will create a port-forwarding tunnel, allowing you to access the Presto UI at http://localhost:8080 on your local machine. 

**Step 7: Uninstall Presto** 

`helm uninstall my-presto` 

If you wish to remove the Presto deployment, use this command to uninstall the release. 

**Step 8: Install Presto in Cluster Mode** 

`helm install my-presto presto/presto --set mode=cluster` 

This command will install Presto in the cluster mode, suitable for production environments with one coordinator and multiple workers. 

**Step 9: Check Deployment Status** 

`kubectl get pods` 

Ensure that all Presto Pods are running and ready. 

**Step 10: Access Presto UI** 

`kubectl port-forward svc/my-presto-coordinator 8080:8080` 

Access the Presto UI at http://localhost:8080 on your local machine. 

**Step 11: Install Presto in Highly Available (HA) Cluster Mode** 

`helm install my-presto presto/presto --set mode=ha --set coordinator.replicas=2` 

This command will install Presto in the highly available cluster mode with two coordinators and multiple workers. 

**Step 12: Check Deployment Status** 

`kubectl get pods` 

Ensure all Presto Pods, including coordinators and workers, are running and ready. 

**Step 13: Access Presto UI** 

`kubectl port-forward svc/my-presto-coordinator 8080:8080` 

Access the Presto UI at http://localhost:8080 on your local machine. 

Congratulations! You have successfully installed Presto on Kubernetes using the Helm package manager. With Presto up and running, you can now explore its powerful distributed SQL query capabilities and utilize Kubernetes' scalability and resource management features for efficient data analytics. Remember to customize the values in `presto-values.yaml` and the Helm commands according to your specific requirements and environment. 

## Future Initiatives 

While the Presto Helm chart offers a streamlined deployment experience, there are ongoing initiatives and future improvements on the roadmap. Documentation, testing, auto-scaling capabilities, support for high-performance native workers, and additional features and enhancements are some areas of focus.  

We encourage the community to contribute to the chart's development by reporting issues, suggesting features, and submitting pull requests. With these ongoing efforts, the Presto Helm chart aims to achieve a stable 1.0 release and further enhance the deployment experience for data engineers. Here’s the repo: <a href="https://github.com/prestodb/presto-helm-charts" style="color:blue;">https://github.com/prestodb/presto-helm-charts</a>. 

Check out the full <a href="https://www.youtube.com/watch?v=qZwA4MSN08I&list=PLJVeO1NMmyqXm5_fuFoKyMfZWyT5jOeKh&index=19" style="color:blue;">presentation from PrestoCon Day here</a>. 
