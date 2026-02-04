FROM jenkins/jenkins:lts

USER root

# Install prerequisites and ICU libraries for .NET
RUN apt-get update && \
    apt-get install -y wget curl apt-transport-https gnupg libicu-dev

# Install .NET SDK 9.0
RUN wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh && \
    chmod +x dotnet-install.sh && \
    ./dotnet-install.sh --channel 9.0 --install-dir /usr/share/dotnet && \
    ln -s /usr/share/dotnet/dotnet /usr/local/bin/dotnet && \
    rm dotnet-install.sh

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install Chrome for headless testing
RUN wget -q -O /tmp/chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get install -y /tmp/chrome.deb || apt-get install -yf && \
    rm /tmp/chrome.deb && \
    ln -s /usr/bin/google-chrome-stable /usr/local/bin/google-chrome

# Clean up
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER jenkins