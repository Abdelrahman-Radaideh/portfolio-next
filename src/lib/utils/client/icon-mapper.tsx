import React from 'react';
import {
    SiPython, SiJavascript, SiCplusplus, SiTypescript, SiPhp, SiRuby, SiGo, SiSwift, SiKotlin, SiRust, SiDart, SiScala, SiR, SiMysql, SiHtml5, SiReact, SiAngular, SiVuedotjs, SiNextdotjs, SiSvelte, SiJquery, SiBootstrap, SiTailwindcss, SiNodedotjs, SiDjango, SiFlask, SiSpringboot, SiDotnet, SiLaravel, SiExpress, SiRubyonrails, SiFastapi, SiGraphql, SiPostgresql, SiMongodb, SiRedis, SiSqlite, SiApachecassandra, SiElasticsearch, SiFirebase, SiMariadb, SiGooglecloud, SiDocker, SiKubernetes, SiJenkins, SiTerraform, SiAnsible, SiGitlab, SiCircleci, SiNginx, SiApache, SiLinux, SiUbuntu, SiGnubash, SiGit, SiGithub, SiTensorflow, SiPytorch, SiScikitlearn, SiPandas, SiNumpy, SiApachespark, SiApachehadoop, SiFlutter, SiIonic, SiAndroid, SiIos, SiUnity, SiUnrealengine, SiFigma, SiPostman, SiJira, SiSelenium, SiCypress, SiWireshark, SiMetasploit, SiOwasp, SiSplunk, SiDatadog, SiPrometheus, SiGrafana, SiBlockchaindotcom, SiEthereum, SiSolidity, SiWebassembly, SiOpenai, SiAppium, SiSwagger,
    SiReplit, SiAnthropic, SiGithubcopilot, SiSupabase, SiCloudinary, SiVercel
} from "react-icons/si";
import { FaDatabase, FaServer, FaCode, FaJava, FaMicrosoft, FaChartLine, FaRobot, FaMousePointer, FaRocket, FaMagic, FaAws } from "react-icons/fa";
import { BiLogoAws } from "react-icons/bi";

// Map specifically requested technologies
const iconMap: { [key: string]: React.ReactNode } = {
    "Python": <SiPython />,
    "JavaScript": <SiJavascript />,
    "Java": <FaJava />, // Fixed: SiJava not found, using FaJava
    "C#": <span className="font-bold text-xs">C#</span>, // Manual fallback
    "C++": <SiCplusplus />,
    "TypeScript": <SiTypescript />,
    "PHP": <SiPhp />,
    "Ruby": <SiRuby />,
    "Go": <SiGo />,
    "Swift": <SiSwift />,
    "Kotlin": <SiKotlin />,
    "Rust": <SiRust />,
    "Dart": <SiDart />,
    "Scala": <SiScala />,
    "R": <SiR />,
    "SQL": <FaDatabase />,
    "HTML5": <SiHtml5 />,
    "React": <SiReact />,
    "Angular": <SiAngular />,
    "Vue.js": <SiVuedotjs />,
    "Next.js": <SiNextdotjs />,
    "Svelte": <SiSvelte />,
    "jQuery": <SiJquery />,
    "Bootstrap": <SiBootstrap />,
    "Tailwind CSS": <SiTailwindcss />,
    "Node.js": <SiNodedotjs />,
    "Django": <SiDjango />,
    "Flask": <SiFlask />,
    "Spring Boot": <SiSpringboot />,
    "ASP.NET Core": <SiDotnet />,
    "Laravel": <SiLaravel />,
    "Express.js": <SiExpress />,
    "Ruby on Rails": <SiRubyonrails />,
    "FastAPI": <SiFastapi />,
    "GraphQL": <SiGraphql />,
    "REST API": <FaServer />,
    "PostgreSQL": <SiPostgresql />,
    "MySQL": <SiMysql />,
    "MongoDB": <SiMongodb />,
    "Redis": <SiRedis />,
    "Microsoft SQL Server": <FaDatabase />, // Fixed: SiMicrosoftsqlserver not found
    "SQLite": <SiSqlite />,
    "Cassandra": <SiApachecassandra />,
    "Elasticsearch": <SiElasticsearch />,
    "Firebase": <SiFirebase />,
    "MariaDB": <SiMariadb />,
    "DynamoDB": <BiLogoAws />,
    "Microsoft Azure": <FaMicrosoft />, // Fixed: SiMicrosoftazure not found
    "Google Cloud Platform": <SiGooglecloud />,
    "Docker": <SiDocker />,
    "Kubernetes": <SiKubernetes />,
    "Jenkins": <SiJenkins />,
    "Terraform": <SiTerraform />,
    "Ansible": <SiAnsible />,
    "GitLab CI": <SiGitlab />,
    "CircleCI": <SiCircleci />,
    "Nginx": <SiNginx />,
    "Apache HTTP Server": <SiApache />,
    "Linux": <SiLinux />,
    "Ubuntu": <SiUbuntu />,
    "Bash/Shell": <SiGnubash />,
    "Git": <SiGit />,
    "GitHub": <SiGithub />,
    "TensorFlow": <SiTensorflow />,
    "PyTorch": <SiPytorch />,
    "Scikit-learn": <SiScikitlearn />,
    "Pandas": <SiPandas />,
    "NumPy": <SiNumpy />,
    "Apache Spark": <SiApachespark />,
    "Hadoop": <SiApachehadoop />,
    "Power BI": <FaChartLine />, // Using generic chart icon if not found
    "Flutter": <SiFlutter />,
    "React Native": <SiReact />,
    "Ionic": <SiIonic />,
    "Android": <SiAndroid />,
    "iOS": <SiIos />,
    "Unity": <SiUnity />,
    "Unreal Engine": <SiUnrealengine />,
    "Figma": <SiFigma />,
    "Postman": <SiPostman />,
    "Jira": <SiJira />,
    "Selenium": <SiSelenium />,
    "Appium": <SiAppium />,
    "Playwright": <FaRobot />, // Fallback as SiPlaywright is missing in this version
    "Cypress": <SiCypress />,
    "Wireshark": <SiWireshark />,
    "Metasploit": <SiMetasploit />,
    "OWASP ZAP": < SiOwasp />,
    "Splunk": <SiSplunk />,
    "Datadog": <SiDatadog />,
    "Prometheus": <SiPrometheus />,
    "Grafana": <SiGrafana />,
    "Blockchain": <SiBlockchaindotcom />,
    "Ethereum": <SiEthereum />,
    "Solidity": <SiSolidity />,
    "WebAssembly": <SiWebassembly />,
    "Swagger": <SiSwagger />,
    "OpenAI API": <SiOpenai />,
    "Cursor IDE": <FaMousePointer />,
    "Replit": <SiReplit />,
    "Antigravity IDE": <FaRocket />,
    "Claude Code": <SiAnthropic />,
    "GitHub Copilot": <SiGithubcopilot />,
    "Vibe Coding": <FaMagic />,
    "AWS Cloud": <FaAws />,
    "Supabase": <SiSupabase />,
    "Cloudinary": <SiCloudinary />,
    "Vercel": <SiVercel />
};

export const getIconForTechnology = (name: string): React.ReactNode => {
    // Exact match
    if (iconMap[name]) {
        return iconMap[name];
    }

    // Case insensitive match
    const lowerName = name.toLowerCase();
    const entry = Object.entries(iconMap).find(([key]) => key.toLowerCase() === lowerName);
    if (entry) {
        return entry[1];
    }

    // Default icon
    return <FaCode />;
};

export const technologyCategories: { [key: string]: string } = {
    "JavaScript": "Frontend", "TypeScript": "Frontend", "HTML5": "Frontend", "React": "Frontend", "Angular": "Frontend", "Vue.js": "Frontend", "Next.js": "Frontend", "Svelte": "Frontend", "jQuery": "Frontend", "Bootstrap": "Frontend", "Tailwind CSS": "Frontend", "WebAssembly": "Frontend",
    "Python": "Backend", "Java": "Backend", "C#": "Backend", "C++": "Backend", "PHP": "Backend", "Ruby": "Backend", "Go": "Backend", "Scala": "Backend", "Rust": "Backend", "Node.js": "Backend", "Django": "Backend", "Flask": "Backend", "Spring Boot": "Backend", "ASP.NET Core": "Backend", "Laravel": "Backend", "Express.js": "Backend", "Ruby on Rails": "Backend", "FastAPI": "Backend", "GraphQL": "Backend", "REST API": "Backend",
    "SQL": "Database", "PostgreSQL": "Database", "MySQL": "Database", "MongoDB": "Database", "Redis": "Database", "Microsoft SQL Server": "Database", "SQLite": "Database", "Cassandra": "Database", "Elasticsearch": "Database", "Firebase": "Database", "MariaDB": "Database", "DynamoDB": "Database", "Supabase": "Database",
    "Microsoft Azure": "Cloud & DevOps", "Google Cloud Platform": "Cloud & DevOps", "Docker": "Cloud & DevOps", "Kubernetes": "Cloud & DevOps", "Jenkins": "Cloud & DevOps", "Terraform": "Cloud & DevOps", "Ansible": "Cloud & DevOps", "GitLab CI": "Cloud & DevOps", "CircleCI": "Cloud & DevOps", "Nginx": "Cloud & DevOps", "Apache HTTP Server": "Cloud & DevOps", "Linux": "Cloud & DevOps", "Ubuntu": "Cloud & DevOps", "Bash/Shell": "Cloud & DevOps", "AWS Cloud": "Cloud & DevOps", "Cloudinary": "Cloud & DevOps", "Vercel": "Cloud & DevOps",
    "TensorFlow": "AI & Vibe Coding", "PyTorch": "AI & Vibe Coding", "Scikit-learn": "AI & Vibe Coding", "Pandas": "AI & Vibe Coding", "NumPy": "AI & Vibe Coding", "Apache Spark": "AI & Vibe Coding", "Hadoop": "AI & Vibe Coding", "OpenAI API": "AI & Vibe Coding", "Cursor IDE": "AI & Vibe Coding", "Claude Code": "AI & Vibe Coding", "GitHub Copilot": "AI & Vibe Coding", "Vibe Coding": "AI & Vibe Coding",
    "Swift": "Mobile", "Kotlin": "Mobile", "Dart": "Mobile", "Flutter": "Mobile", "React Native": "Mobile", "Ionic": "Mobile", "Android": "Mobile", "iOS": "Mobile",
    "R": "Tools & Testing", "Git": "Tools & Testing", "GitHub": "Tools & Testing", "Power BI": "Tools & Testing", "Unity": "Tools & Testing", "Unreal Engine": "Tools & Testing", "Figma": "Tools & Testing", "Postman": "Tools & Testing", "Jira": "Tools & Testing", "Selenium": "Tools & Testing", "Appium": "Tools & Testing", "Playwright": "Tools & Testing", "Cypress": "Tools & Testing", "Wireshark": "Tools & Testing", "Metasploit": "Tools & Testing", "OWASP ZAP": "Tools & Testing", "Splunk": "Tools & Testing", "Datadog": "Tools & Testing", "Prometheus": "Tools & Testing", "Grafana": "Tools & Testing", "Blockchain": "Tools & Testing", "Ethereum": "Tools & Testing", "Solidity": "Tools & Testing", "Swagger": "Tools & Testing", "Replit": "Tools & Testing", "Antigravity IDE": "Tools & Testing"
};

export const availableTechnologies = Object.keys(iconMap);
