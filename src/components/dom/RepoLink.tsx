import ghLogo from "@assets/github-mark-white.svg";

export function RepoLink() {
  return (
    <div className="repo-link">
      <img src={ghLogo} alt="GitHub logo" style={{ height: "1.5em" }} />
      <a
        href="https://github.com/warmbowski/mol-file-viewer"
        target="_blank"
        rel="noreferrer"
      >
        Mol File Viewer repository
      </a>
    </div>
  );
}
