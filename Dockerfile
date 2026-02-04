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

# Install Chromium (alternative to Chrome, works with Angular tests)
RUN apt-get install -y chromium chromium-driver

# Set environment variable for Chromium
ENV CHROME_BIN=/usr/bin/chromium

# Clean up
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER jenkins