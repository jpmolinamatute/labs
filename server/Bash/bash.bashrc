# /etc/bash.bashrc

# If not running interactively, don't do anything

if [[ $- != *i* ]]; then
	# Shell is non-interactive.  Be done now!
	exit 1
fi

set_prompt() {
	last_command=$?
	blue=$(tput setaf 4)
	cyan=$(tput setaf 6)
	reset=$(tput sgr0)
	part1='\342\224\214\342\224\200\342\224\200\342\224\200('                # --(
	part2=')\342\224\200\342\224\200\342\224\200('                           # )--(
	part3=')\n\342\224\224\342\224\200\342\224\200\342\224\200\342\225\274 ' # )
	second='\342\224\224\342\224\200\342\224\200\342\224\200\342\225\274 '
	if [[ $EUID -eq 0 ]]; then
		userColor=$(tput setaf 3)
	else
		userColor=$(tput setaf 7)
	fi

	if [[ $last_command -eq 0 ]]; then
		validColor=$(tput setaf 2)
		x='\342\234\223'
	else
		validColor=$(tput setaf 1)
		x='\342\234\227'
	fi
	PS1="\\[${userColor}\\]${part1}\\[${validColor}\\]${x}\\[${userColor}\\]${part2}\\[${cyan}\\]\h\\[${userColor}\\]${part2}\\[${cyan}\\]\u\\[${userColor}\\]${part2}\\[${cyan}\\]\D{%r}\\[${userColor}\\]${part2}\\[${blue}\\]\w\\[${userColor}\\]${part3}\\[${reset}\\]"
	PS2="\\[${userColor}\\]${second}\\[${reset}\\]"
}

PROMPT_COMMAND=set_prompt
shopt -s checkwinsize
shopt -s histappend
shopt -s autocd
shopt -s extglob
export CONCURRENCY_LEVEL=4
export VISUAL="/usr/bin/vim -p -X"
export EDITOR="/usr/bin/vim"
export LC_ALL="en_CA.UTF-8"
export HISTSIZE=10000
export HISTFILESIZE=10000

# export HISTCONTROL=ignoreboth
bind '"\e[A": history-search-backward'
bind '"\e[B": history-search-forward'

alias ls='ls -l --almost-all --human-readable --classify --color=always --group-directories-first'
alias grep='grep --color=auto'
alias cd..="cd .."
alias cd...=" cd ../.."
alias cd....=" cd ../../.."
alias diff="diff -yZbwB --suppress-common-lines"
alias history="history | less"
alias df='df -h'
alias du='du -c -h'
alias mkdir='mkdir -p'
alias ping='ping -c 5'
alias ldir="ls -ldh --color=always"
alias status="systemctl status"
alias pacs="pacman -Ss"
alias paci="pacman -Si"
alias pacl="pacman -Sl"
alias pacll="pacman -Qqm"
alias paclo="pacman -Qdt"
alias pacf="pacman -Ql"
alias paco="pacman -Qo"
alias all="systemctl list-unit-files"
alias failed="systemctl --failed"

hist() {
	history | grep "$1"
}

man() {
	env LESS_TERMCAP_mb="$(printf '\e[1;31m')" \
		LESS_TERMCAP_md="$(printf '\e[1;31m')" \
		LESS_TERMCAP_me="$(printf '\e[0m')" \
		LESS_TERMCAP_se="$(printf '\e[0m')" \
		LESS_TERMCAP_so="$(printf '\e[1;44;33m')" \
		LESS_TERMCAP_ue="$(printf '\e[0m')" \
		LESS_TERMCAP_us="$(printf '\e[1;32m')" \
		man "$@"
}

# Try to keep environment pollution down, EPA loves us.
unset use_color safe_term match_lhs
clear
if [[ $EUID -eq 0 ]]; then
	alias pac="pacman -S --noconfirm --needed"
	alias pacu="pacman -Syu --noconfirm"
	alias pacr="pacman -Rns --noconfirm"
	alias pacc="pacman -Sc"
	alias pacmir="pacman -Syyu --noconfirm"
	alias pacror='pacman -Rns $(pacman -Qtdq)'
	alias stop="systemctl stop"
	alias start="systemctl start"
	alias restart="systemctl restart"
	alias senable="systemctl enable --now"
	alias disable="systemctl disable --now"
    # export TMOUT=180
    # readonly TMOUT
else
	alias pac="sudo pacman -S --noconfirm --needed"
	alias pacu="sudo pacman -Syu --noconfirm"
	alias pacr="sudo pacman -Rns --noconfirm"
	alias pacc="sudo pacman -Sc"
	alias pacmir="sudo pacman -Syyu --noconfirm"
	alias pacror='sudo pacman -Rns $(pacman -Qtdq)'
	alias stop="sudo systemctl stop"
	alias start="sudo systemctl start"
	alias restart="sudo systemctl restart"
	alias senable="sudo systemctl enable --now"
	alias disable="sudo systemctl disable --now"
	alias pacm="makepkg -fcis"
fi

[[ -r /usr/share/bash-completion/bash_completion ]] && . /usr/share/bash-completion/bash_completion
[[ -r /usr/share/git/completion/git-completion.bash ]] && . /usr/share/git/completion/git-completion.bash

